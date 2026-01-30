/**
 * Quản lý lưu trữ preferences (goals + topics) của người dùng
 * Sử dụng localStorage để lưu persistent data
 */

export interface LearningPathPreference {
  goalCode: string;
  topicCode: string;
  timestamp: number;
}

const STORAGE_KEY = 'aesp_learning_preference';

/**
 * Lưu goals + topics vào localStorage
 * Gọi sau khi người dùng hoàn tất setup hoặc thanh toán
 */
export const saveLearningPathPreference = (goalCode: string, topicCode: string): void => {
  const preference: LearningPathPreference = {
    goalCode,
    topicCode,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    console.log('✅ Saved learning path preference:', preference);
  } catch (error) {
    console.error('❌ Error saving preference:', error);
  }
};

/**
 * Lấy goals + topics từ localStorage
 */
export const getLearningPathPreference = (): LearningPathPreference | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const preference = JSON.parse(data) as LearningPathPreference;
    console.log('✅ Retrieved learning path preference:', preference);
    return preference;
  } catch (error) {
    console.error('❌ Error reading preference:', error);
    return null;
  }
};

/**
 * Xóa preference (khi người dùng click "Xóa bộ lọc")
 */
export const clearLearningPathPreference = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Cleared learning path preference');
  } catch (error) {
    console.error('❌ Error clearing preference:', error);
  }
};

/**
 * Kiểm tra xem preference còn hợp lệ không
 * (ví dụ: nếu cũ hơn 7 ngày thì expire)
 */
export const isPreferenceExpired = (daysExpire: number = 7): boolean => {
  const preference = getLearningPathPreference();
  if (!preference) return true;
  
  const now = Date.now();
  const expiryTime = preference.timestamp + (daysExpire * 24 * 60 * 60 * 1000);
  return now > expiryTime;
};
