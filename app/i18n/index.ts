import { zh } from './zh';

export const i18n = {
    currentLocale: 'zh',
    translations: {
        zh
    },
    t(key: string, params: Record<string, string> = {}): string {
        const keys = key.split('.');
        let value = this.translations[this.currentLocale];
        
        for (const k of keys) {
            value = value[k];
            if (!value) return key;
        }

        if (typeof value === 'string') {
            return Object.entries(params).reduce(
                (str, [key, val]) => str.replace(`{${key}}`, val),
                value
            );
        }

        return value;
    }
};