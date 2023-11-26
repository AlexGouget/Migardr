export class HashPassword {
    constructor(private _password: string) {
        return this;
    }

    public async hash(): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(this._password);

        // Hacher le mot de passe avec SHA-256
        const hash = await crypto.subtle.digest('SHA-256', data);

        // Convertir le résultat en chaîne hexadécimale
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Compare le mot de passe avec le hash
     * @param password
     */
    public async compare(password: string): Promise<boolean> {
        const encodedPasswordToCompare = await this.hash();
        return password === encodedPasswordToCompare;
    }


}