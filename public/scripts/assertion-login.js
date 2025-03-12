class Login {
    async init() {
        
        await this.checkConditionalMediationSupport()
        
        const challenge = await this.getChallenge()
        
        const credentials = await this.authenticateUserWith(challenge)
        
        const currentUser = await this.loginWith(credentials)
        
        this.redirect(currentUser)
    }

    async checkConditionalMediationSupport() {
        const isCMA =
            await window.PublicKeyCredential.isConditionalMediationAvailable()
        if (!isCMA) return
    }

    async getChallenge() {
        const response = await fetch('/login/public-key/challenge', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        })

        return response.json()
    }

    async authenticateUserWith(challengeResponse) {
        const options = {
            mediation: 'conditional',
            publicKey: {
                challenge: base64url.decode(challengeResponse.challenge),
            },
        }
        const credentials = await navigator.credentials.get(options)
        return credentials
    }

    buildLoginOptionsWith(userCredentials) {
        const body = {
            id: userCredentials.id,
            response: {
                clientDataJSON: base64url.encode(
                    userCredentials.response.clientDataJSON
                ),
                authenticatorData: base64url.encode(
                    userCredentials.response.authenticatorData
                ),
                signature: base64url.encode(
                    userCredentials.response.signature
                ),
                userHandle: userCredentials.response.userHandle
                    ? base64url.encode(userCredentials.response.userHandle)
                    : null,
            },
        }

        if (userCredentials.authenticatorAttachment) {
            body.authenticatorAttachment =
			userCredentials.authenticatorAttachment
        }

        return body
    }

    async loginWith(userCredentials) {
        const options = this.buildLoginOptionsWith(userCredentials)

        const response = await fetch('/login/public-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(options)
        })

        return response.json()
    }

    redirect(currentUser) {
        window.location.href = currentUser.destination
    }
}

window.addEventListener('load', async () => {
    const login = new Login()

    if (window.PublicKeyCredential) {
        await login.init()
    }
})