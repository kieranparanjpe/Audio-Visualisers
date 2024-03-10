class SpotifyHandler {

    static clientId = "d2c5cbeadeee473e9bcf40fa0e97269e";
    static params = new URLSearchParams(window.location.search);
    static code = SpotifyHandler.params.get("code");

    //For development use:
    //static redirect = 'http://localhost:63342/index.html/root/index.html?_ijt=35r82o8pqti4dgdirjkjsh12nl&_ij_reload=RELOAD_ON_SAVE';
    //For production use:
    static redirect = 'https://audio-visualisers-b0876.web.app/';
    static profile = null;
    static accessToken;
    static details;
    static song;

    static spotifySignIn() {
        SpotifyHandler.redirectToAuthCodeFlow(SpotifyHandler.clientId);
    }

    static async initialise() {
        if (!SpotifyHandler.code)
            return;

        SpotifyHandler.accessToken = await SpotifyHandler.getAccessToken(SpotifyHandler.clientId, SpotifyHandler.code);
        SpotifyHandler.profile = await SpotifyHandler.fetchProfile(SpotifyHandler.accessToken);
    }

    static async getAccessToken(clientId, code) {
        const verifier = localStorage.getItem("verifier");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", SpotifyHandler.redirect);
        params.append("code_verifier", verifier);

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params
        });

        const {access_token} = await result.json();
        return access_token;
    }


    static async fetchProfile() {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET", headers: {Authorization: `Bearer ${SpotifyHandler.accessToken}`}
        });

        return await result.json();
    }

    static async updateSong() {
        if (SpotifyHandler.code && SpotifyHandler.profile.email != null) {
            let old = "";
            if(SpotifyHandler.song)
                old = SpotifyHandler.song.item.id;

            SpotifyHandler.song = await SpotifyHandler.getCurrentSong();

            if(!SpotifyHandler.song)
            {
                SpotifyHandler.accessToken = await SpotifyHandler.getAccessToken(SpotifyHandler.clientId, SpotifyHandler.code);
                SpotifyHandler.profile = await SpotifyHandler.fetchProfile(SpotifyHandler.accessToken);
                return;
            }

            if(SpotifyHandler.song.item.id == old)
                return;

            SpotifyHandler.details = await SpotifyHandler.getSongDetails(SpotifyHandler.song.item.id);
            document.getElementById("CurrentlyPlaying").innerText = `Currently Playing: ${SpotifyHandler.song.item.name} by 
            ${SpotifyHandler.song.item.artists[0].name}`;

            if(SpotifyHandler.details != null) {
                ColourManager.getPalette(SpotifyHandler.song.item.album.images[0].url);
                onNewSong();
                radialVisualiser.newSong();
            }
        }
    }

    static async getCurrentSong() {
        const resultA = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            method: "GET", headers: {Authorization: `Bearer ${SpotifyHandler.accessToken}`}
        });

        return await resultA.json();
    }

    static async getSongDetails(id) {
        const resultB = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
            method: "GET", headers: {Authorization: `Bearer ${SpotifyHandler.accessToken}`}
        });
        if(resultB.ok){
            const json = await resultB.json();
            return json;
        }

        return null;
    }

    static async redirectToAuthCodeFlow(clientId) {
        const verifier = SpotifyHandler.generateCodeVerifier(128);
        const challenge = await SpotifyHandler.generateCodeChallenge(verifier);

        localStorage.setItem("verifier", verifier);

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", SpotifyHandler.redirect);
        params.append("scope", "user-read-private user-read-email user-read-currently-playing");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);

        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    static generateCodeVerifier(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    static async generateCodeChallenge(codeVerifier) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}