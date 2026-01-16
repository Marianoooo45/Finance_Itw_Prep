export const STORAGE_KEYS = {
    STREAK: 'finance_prep_streak',
    LAST_LOGIN: 'finance_prep_last_login',
    VIEWED_SHEETS: 'finance_prep_viewed_sheets',
};

// --- DAILY STREAK ---

export function checkAndUpdateStreak(): number {
    if (typeof window === 'undefined') return 0;

    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    let streak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '0', 10);

    if (lastLogin === today) {
        // Already logged in today, do nothing
        return streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLogin === yesterday.toDateString()) {
        // Consecutive day
        streak += 1;
    } else {
        // Missed a day (or first time)
        streak = 1; // RESET to 1 (because today is a login) or start at 1
    }

    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, today);

    return streak;
}

export function getStreak(): number {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '0', 10);
}


// --- PROGRESS TRACKING ---

export function markSheetAsViewed(sheetId: string) {
    if (typeof window === 'undefined') return;

    const viewed = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWED_SHEETS) || '[]');
    if (!viewed.includes(sheetId)) {
        viewed.push(sheetId);
        localStorage.setItem(STORAGE_KEYS.VIEWED_SHEETS, JSON.stringify(viewed));
        // Dispatch custom event to notify listeners (like the homepage progress bar)
        window.dispatchEvent(new Event('progress-updated'));
    }
}

export function getProgressCount(): number {
    if (typeof window === 'undefined') return 0;
    const viewed = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWED_SHEETS) || '[]');
    return viewed.length;
}

export function getProgressPercentage(total: number): number {
    if (total === 0) return 0;
    const count = getProgressCount();
    return Math.min(Math.round((count / total) * 100), 100);
}
