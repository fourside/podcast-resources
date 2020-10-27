export type PostBody = {
  stationId: string;
  title: string;
  fromTime: string;
  duration: string;
  personality: string;
};

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export function validatePostBody(postBody: PostBody): ValidationResult {
  const { stationId, title, fromTime, duration, personality } = postBody;
  if (!stationId) {
    return { isValid: false, message: "stationId is required" };
  }
  if (!title) {
    return { isValid: false, message: "title is required" };
  }
  // 202010102330
  if (!/^\d{12}$/.test(fromTime)) {
    return { isValid: false, message: "fromTime must be 12 digits" };
  }
  if (!/^\d+$/.test(duration)) {
    return { isValid: false, message: "duration must be digits" };
  }
  if (!personality) {
    return { isValid: false, message: "personality is required" };
  }

  return { isValid: true };
}
