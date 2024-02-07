export class SocialShare {
  url: URL;

  title: string;

  constructor(url: URL, title: string) {
    this.url = url;
    this.title = title;
  }

  getFacebookShareUrl() {
    const { url, title } = this;

    const params = new URLSearchParams({
      u: url.href,
      quote: title
    });

    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }

  getTwitterShareUrl() {
    const { url, title } = this;

    const params = new URLSearchParams({
      text: `${title} - ${url.href}`
    });

    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }

  getLinkedinShareUrl() {
    const { url } = this;

    const params = new URLSearchParams({
      url: url.href
    });

    return `https://www.linkedin.com/sharing/share-offsite?${params.toString()}`;
  }
}
