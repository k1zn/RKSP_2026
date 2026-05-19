import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LogUser {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class ActivityLoggerService {
  private getLogPath(): string {
    const date = new Date().toISOString().slice(0, 10);
    const dir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, `${date}.log`);
  }

  log(action: string, user?: LogUser, details?: string): void {
    const now = new Date().toLocaleString('ru-RU');
    const who = user
      ? `${user.email} (id:${user.id}, ${user.role})`
      : 'anonymous';
    const line = `[${now}] [${who}] ${action}${details ? ': ' + details : ''}\n`;
    fs.appendFileSync(this.getLogPath(), line, 'utf-8');
  }
}
