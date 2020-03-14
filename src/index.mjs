import ApiClient from "api-reach";

const DEFAULT_TWEAKS = {
    wacky: 50,
    talkative: 50,
    attentive: 50,
};

class CleverBot {
    constructor(API_KEY, { cs, tweaks } = {}) {
        this._key = API_KEY;
        this._cs = cs;
        this._tweaks = tweaks;

        this._api = new ApiClient({
            base: "https://www.cleverbot.com",
        });
    }

    async query(message, { cs, tweaks } = {}) {
        const currentTweaks = tweaks || {};
        Object.keys(currentTweaks).forEach(key => {
            if (currentTweaks[key] == null) {
                delete currentTweaks[key];
            }
        });

        const GET = {
            key: this._key,
            cs: cs || this._cs,
            wrapper: "clever-clever-api",
            input: message,
            ...DEFAULT_TWEAKS,
            ...this._tweaks,
            ...currentTweaks,
        };
        if (!GET.cs) {
            delete GET.cs;
        }
        const { body } = await this._api.get("getreply", GET);
        this._cs = body.cs;
        return body;
    }

    clone() {
        return new CleverBot(this._key, {
            cs: this._cs,
            tweaks: this._tweaks,
        });
    }
}

export default CleverBot;
