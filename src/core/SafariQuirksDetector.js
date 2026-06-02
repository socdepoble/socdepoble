class SafariQuirksDetector {
  constructor() {
    if (SafariQuirksDetector.instance) {
      return SafariQuirksDetector.instance;
    }
    SafariQuirksDetector.instance = this;
    
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  isPotentiallyQuirky() {
    return this.isSafari || this.isIOS;
  }
}

export const quirksDetector = new SafariQuirksDetector();
