import Logger from 'bunyan';

declare function debugnyan(name: string, options?: Partial<Logger.LoggerOptions>, { prefix, simple, suffix }?: {
    prefix?: string;
    simple?: boolean;
    suffix?: string;
}): Logger;

export = debugnyan;
