import { EventEmitter } from "events";

interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null | undefined;
	mfa_enabled?: true;
	locale?: string;
	verified?: boolean;
	email?: string | null | undefined;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
}

interface Member {
	user?: User;
	nick: string | null | undefined;
	roles: string[];
	joined_at: number;
	premium_since?: number | null | undefined;
	deaf: boolean;
	mute: boolean;
}

// This is not accurate as discord sends a partial object
interface Integration {
	id: string;
	name: string;
	type: string;
	enabled: boolean;
	syncing: boolean;
	role_id: string;
	enable_emoticons?: boolean;
	expire_behavior: 0 | 1;
	expire_grace_period: number;
	user?: User;
	account: {
		id: string;
		name: string;
	};
	synced_at: number;
	subscriber_count: number;	
	revoked: boolean;
	application?: Application;
}

interface Connection {
	id: string;
	name: string;
	type: string;
	revoked?: string;
	integrations?: Integration[];
	verified: boolean;
	friend_sync: boolean;
	show_activity: boolean;
	visibility: 0 | 1;
}

interface Application {
	id: string;
	name: string;
	icon: string | null | undefined;
	description: string;
	summary: string;
	bot?: User;
}

interface TokenRequestResult {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

declare class OAuth extends EventEmitter {
	constructor(opts?: {
		version?: string,
		clientId?: string,
		redirectUri?: string,
		credentials?: string,
		clientSecret?: string,
		requestTimeout?: number,
		latencyThreshold?: number,
		ratelimiterOffset?: number,
	});
	on(event: "debug" | "warn", listener: (message: string) => void): this;
	tokenRequest(opts: {
		code?: string,
		scope: string[] | string,
		clientId?: string,
		grantType: "authorization_code" | "refresh_token",
		redirectUri?: string,
		refreshToken?: string,
		clientSecret?: string,
	}): Promise<TokenRequestResult>;
	revokeToken(access_token: string, credentials?: string): Promise<string>;
	getUser(access_token: string): Promise<User>;
	getUserGuilds(access_token: string): Promise<PartialGuild[]>;
	getUserConnections(access_token: string): Promise<Connection[]>;
	addMember(opts: {
		deaf?: boolean,
		mute?: boolean,
		roles?: string[],
		nickname?: string,
		userId: string,
		guildId: string,
		botToken: string,
		accessToken: string,
	}): Promise<Member>;
	generateAuthUrl(opts: {
		scope: string[] | string,
		state?: string,
		clientId?: string,
		prompt?: "consent" | "none",
		redirectUri?: string,
		responseType?: "code" | "token",
		permissions?: number,
		guildId?: string,
		disableGuildSelect?: boolean,
	}): string;
}

export = OAuth;
