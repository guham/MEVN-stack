export const SOMETHING_WENT_WRONG = '';

export default class Notification {
  constructor(type, text) {
    this.type = type || 'info';
    this.text = text || '';
  }
}
