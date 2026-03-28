export const stakingPendingIncomeCalculator = (createdAt: string, amount: number) => {
    const start = new Date(createdAt.replace(' ', 'T'));
    const now = new Date();

    start.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    let days = Math.floor((now.getTime() - start.getTime()) / 86400000) - 1;
    if (days < 0) days = 0 as any;

    const income = (amount * 0.05 / 30) * days;

    return { days, income };
}

