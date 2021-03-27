import * as request from 'request';

const requester = request.defaults({ jar: true });

export interface PreviewEmail {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_timestamp: string;
  mail_read: '0' | '1';
  mail_date: string;
}

export interface FullEmail extends PreviewEmail {
  mail_body: string;
  reply_to: string;
  content_type: string;
  ver: string;
  sid_token: string;
  ref_mid: string;
  mail_size: string;
}

export class Guerrilla {
  private readonly ip: string;
  private readonly agent: string;
  private email: string;
  private lastId: string;

  constructor(ip = '127.0.0.1', agent = 'hoffmann-test-client') {
    this.ip = ip;
    this.agent = agent;
  }

  private getEndpoint(apiFunction: string) {
    return `https://api.guerrillamail.com/ajax.php?f=${apiFunction}`;
  }

  private getMails(url: string) {
    return new Promise<Array<PreviewEmail>>((resolve, reject) => {
      requester(url, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(body).list);
          } catch (parsingError) {
            reject(parsingError);
          }
        }
      });
    });
  }

  getEmailAddress() {
    if (this.email) {
      return Promise.resolve(this.email);
    }

    return new Promise<string>((resolve, reject) => {
      const url = this.getEndpoint('get_email_address');
      requester(url, (err, res, body) => {
        if (err) {
          reject(err);
        } else if (res.statusCode != 200) {
          reject(new Error('An error occurred while requesting e-mail address from guerrilla endpoint'));
        } else {
          resolve((this.email = JSON.parse(body).email_addr));
        }
      });
    });
  }

  setEmailAddress(username: string) {
    const endpoint = this.getEndpoint('set_email_user');
    const url = `${endpoint}&email_user=${username}&lang=en&domain=guerrillamail.com`;

    return new Promise<string>((resolve, reject) => {
      requester(url, (err, res, body) => {
        if (err) {
          reject(err);
        } else if (res.statusCode != 200) {
          reject(new Error('An error occurred while setting e-mail address on guerrilla endpoint'));
        } else {
          resolve((this.email = JSON.parse(body).email_addr));
        }
      });
    });
  }

  getEmail(id: string) {
    const endpoint = this.getEndpoint('fetch_email');
    const url = `${endpoint}&email_id=${id}`;

    return new Promise<FullEmail>((resolve, reject) => {
      requester(url, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(body));
          } catch (parsingError) {
            reject(parsingError);
          }
        }
      });
    });
  }

  getEmailList(offset = 0, sequence?: string) {
    const endpoint = this.getEndpoint('get_email_list');
    const url = `${endpoint}&offset=${offset}` + (sequence ? `&seq=${sequence}` : '');
    return this.getMails(url);
  }

  checkEmails() {
    const updateMarker = (mails: Array<PreviewEmail>) => {
      const lastIndex = mails.length - 1;

      if (lastIndex !== -1) {
        this.lastId = mails[lastIndex].mail_id;
      }

      return mails;
    };

    if (this.lastId) {
      const endpoint = this.getEndpoint('check_email');
      const url = `${endpoint}&seq=${this.lastId}`;
      return this.getMails(url).then(updateMarker);
    }

    return this.getEmailList().then(updateMarker);
  }

  deleteEmail(ids: Array<string>) {
    const endpoint = this.getEndpoint('del_email');
    const url = `${endpoint}&${ids.map(id => `email_ids%5B%5D=${id}`).join('&')}`;

    return new Promise<Array<string>>((resolve, reject) => {
      requester(url, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(body));
          } catch (parsingError) {
            reject(parsingError);
          }
        }
      });
    });
  }
}
