const API_USER_KEY = "API_USER";

const getStoredUser = () => {
    const user = sessionStorage.getItem(API_USER_KEY);
    if (user) {
        return JSON.parse(user);
    }
    return null;
};

const setStoredUser = (user) => {
    sessionStorage.setItem(API_USER_KEY, JSON.stringify(user));
};

const removeStoredUser = () => {
    sessionStorage.removeItem(API_USER_KEY);
};

export { getStoredUser, setStoredUser, removeStoredUser };
