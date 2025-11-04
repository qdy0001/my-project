// 生成随机起始人数（1-2万）
export function getRandomStartCount() {
    return Math.floor(Math.random() * 10000) + 10000;
}

// 格式化倒计时
export function formatCountdown(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 检查是否已添加提醒
export function checkReminderAdded(goodsId) {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    return reminders.includes(goodsId);
}

// 添加提醒到本地
export function addReminderToLocal(goodsId, goodsName, drawTime) {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push(goodsId);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // 调用本地提醒（实际需结合原生能力，此处模拟）
    console.log(`添加提醒：${goodsName}于${drawTime}开奖`);
}

// 获取用户参与次数
export function getParticipationCount() {
    const count = localStorage.getItem('participationCount') || 0;
    return parseInt(count);
}

// 增加参与次数
export function increaseParticipationCount() {
    let count = getParticipationCount();
    count++;
    localStorage.setItem('participationCount', count);
}

// 重置参与次数（每天凌晨重置，此处模拟）
export function resetParticipationCount() {
    localStorage.setItem('participationCount', 0);
}

// 获取当前日期
export function getCurrentDate() {
    const date = new Date();
    return date.toLocaleDateString();
}

// 检查是否需要重置参与次数
export function checkResetCount() {
    const lastResetDate = localStorage.getItem('lastResetDate') || '';
    const currentDate = getCurrentDate();
    if (lastResetDate !== currentDate) {
        resetParticipationCount();
        localStorage.setItem('lastResetDate', currentDate);
    }
}
