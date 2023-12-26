/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./utils/lucia").Auth;
	type DatabaseUserAttributes = Omit<import("./database/schema").User, "id">;
	type DatabaseSessionAttributes = {};
}
