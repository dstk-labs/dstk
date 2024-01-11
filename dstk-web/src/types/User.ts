export type User = {
    dateCreated: string;
    dateModified: string;
    isAdmin: boolean;
    isApproved: boolean;
    isDisabled: boolean;
    primaryEmail: string;
    realName: string;
    userId: string;
    userName: string;
};

export type CreateAccount = {
    createAccount: User;
};
