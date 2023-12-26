/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./utils/lucia").Auth;
	type DatabaseUserAttributes = Pick<import("./database/schema").User, "username">;
	type DatabaseSessionAttributes = {};
}
