import { eq } from "drizzle-orm";

import type { Database } from "@api/db";
import {
	type User,
	type UserSetting,
	user,
	userSettings,
} from "@api/db/schema";

export type UserInsert = {
	id: string;
	name: string;
	email: string;
	emailVerified?: boolean;
	image?: string | null;
};

export type UserUpdate = {
	id: string;
	name?: string;
	email?: string;
	emailVerified?: boolean;
	image?: string | null;
};

export type UserSettingInsert = {
	id: string;
	userId?: string | null;
	memoriesEnabled?: boolean;
	rules?: string | null;
};

export type UserSettingUpdate = {
	id: string;
	userId?: string | null;
	memoriesEnabled?: boolean;
	rules?: string | null;
};

export const createUser = async (
	db: Database,
	data: UserInsert,
): Promise<User[]> => {
	return db.insert(user).values(data).returning();
};

export const getUserById = async (
	db: Database,
	userId: string,
): Promise<User | undefined> => {
	return db.query.user.findFirst({
		where: eq(user.id, userId),
	});
};

export const getUserByEmail = async (
	db: Database,
	email: string,
): Promise<User | undefined> => {
	return db.query.user.findFirst({
		where: eq(user.email, email),
	});
};

export const updateUser = async (
	db: Database,
	data: UserUpdate,
): Promise<User[]> => {
	const { id, ...updateData } = data;
	return db.update(user).set(updateData).where(eq(user.id, id)).returning();
};

// User Delete operations
export const deleteUserById = async (
	db: Database,
	id: string,
): Promise<User[]> => {
	return db.delete(user).where(eq(user.id, id)).returning();
};

export const createUserSetting = async (
	db: Database,
	data: UserSettingInsert,
): Promise<UserSetting[]> => {
	return db.insert(userSettings).values(data).returning();
};

export const getUserSettingById = async (
	db: Database,
	settingId: string,
): Promise<UserSetting | undefined> => {
	return db.query.userSettings.findFirst({
		where: eq(userSettings.id, settingId),
	});
};

export const getUserSettingByUserId = async (
	db: Database,
	userId: string,
): Promise<UserSetting | undefined> => {
	return db.query.userSettings.findFirst({
		where: eq(userSettings.userId, userId),
	});
};

export const updateUserSetting = async (
	db: Database,
	data: UserSettingUpdate,
): Promise<UserSetting[]> => {
	const { id, ...updateData } = data;
	return db
		.update(userSettings)
		.set(updateData)
		.where(eq(userSettings.id, id))
		.returning();
};

export const updateUserSettingByUserId = async (
	db: Database,
	userId: string,
	data: Omit<UserSettingUpdate, "id">,
): Promise<UserSetting[]> => {
	return db
		.update(userSettings)
		.set(data)
		.where(eq(userSettings.userId, userId))
		.returning();
};

export const deleteUserSettingById = async (
	db: Database,
	id: string,
): Promise<UserSetting[]> => {
	return db.delete(userSettings).where(eq(userSettings.id, id)).returning();
};
