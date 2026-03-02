// Extended types for Auth
export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    created_at: string;
}

/** Internal storage type — includes hashed password, never exposed to consumers */
interface StoredUser extends AuthUser {
    hashedPassword: string;
}

export interface AuthSession {
    access_token: string;
    refresh_token: string;
    user: AuthUser;
}

export interface AuthError {
    message: string;
}

export interface AuthResponse {
    data: { user: AuthUser | null; session: AuthSession | null };
    error: AuthError | null;
}

const STORAGE_KEY = 'hylono_mock_auth_users';
const SESSION_KEY = 'hylono_mock_auth_session';

export const MockAuthService = {
    // Simulate network delay
    async _delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // SECURITY: Hash password using SubtleCrypto API (client-side simulation)
    // In production, password hashing MUST happen server-side with bcrypt/argon2
    async _hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'hylono_mock_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Verify password against stored hash
    async _verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        const hash = await this._hashPassword(password);
        return hash === hashedPassword;
    },

    getStoredUsers(): StoredUser[] {
        const users = localStorage.getItem(STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    },

    saveUser(user: AuthUser) {
        const users = this.getStoredUsers();
        users.push(user as StoredUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    },

    getSession(): AuthSession | null {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    setSession(session: AuthSession | null) {
        if (session) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    },

    async signUp({ email, password, name }: { email: string; password: string; name?: string }): Promise<AuthResponse> {
        await this._delay(800);

        const users = this.getStoredUsers();
        if (users.find(u => u.email === email)) {
            return { data: { user: null, session: null }, error: { message: 'User already registered' } };
        }

        const newUser: AuthUser = {
            id: crypto.randomUUID(),
            email,
            name,
            created_at: new Date().toISOString(),
        };

        // SECURITY: Never store plain text passwords!
        // For mock auth, we use a simple hash simulation (in production, use bcrypt server-side)
        const hashedPassword = await this._hashPassword(password);
        const mockDbUser = { ...newUser, hashedPassword };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...users, mockDbUser]));

        const session: AuthSession = {
            access_token: 'mock_access_token_' + newUser.id,
            refresh_token: 'mock_refresh_token_' + newUser.id,
            user: newUser
        };

        this.setSession(session);

        return { data: { user: newUser, session }, error: null };
    },

    async signIn({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
        await this._delay(600);

        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email);

        // SECURITY: Verify hashed password, never compare plain text
        if (!user || !(await this._verifyPassword(password, user.hashedPassword))) {
            return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
        }

        // Strip hashedPassword before returning — never expose it to the application layer
        const { hashedPassword: _hp, ...safeUser }: StoredUser = user;

        const session: AuthSession = {
            access_token: 'mock_access_token_' + safeUser.id,
            refresh_token: 'mock_refresh_token_' + safeUser.id,
            user: safeUser
        };

        this.setSession(session);
        return { data: { user: safeUser, session }, error: null };
    },

    async signOut(): Promise<{ error: AuthError | null }> {
        await this._delay(300);
        this.setSession(null);
        return { error: null };
    },

    async resetPassword(email: string): Promise<{ error: AuthError | null }> {
        await this._delay(1000);
        // Simulate security policy: don't reveal whether a user exists
        // Mock flow intentionally performs no externally visible action.

        return { error: null };
    },

    async updateProfile(updates: Partial<AuthUser>): Promise<AuthResponse> {
        await this._delay(500);
        const session = this.getSession();
        if (!session) return { data: { user: null, session: null }, error: { message: 'No session' } };

        const sanitizedUpdates: Partial<AuthUser> = {};
        if (updates.email !== undefined) sanitizedUpdates.email = updates.email;
        if (updates.name !== undefined) sanitizedUpdates.name = updates.name;

        const updatedUser: AuthUser = { ...session.user, ...sanitizedUpdates };

        // Update in storage
        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === session.user.id);
        if (userIndex >= 0) {
            const existingUser = users[userIndex];
            if (existingUser) {
                users[userIndex] = { ...existingUser, ...sanitizedUpdates };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            }
        }

        const newSession = { ...session, user: updatedUser };
        this.setSession(newSession);

        return { data: { user: updatedUser, session: newSession }, error: null };
    }
};
