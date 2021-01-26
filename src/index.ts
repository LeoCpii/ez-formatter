export interface IConfig {
    length: number;
    regex: RegExp;
    mask: string;
}

interface IFormats {
    cep: (value: string | number) => string;
    cpf: (value: string | number) => string;
    cnpj: (value: string | number) => string;
    cell: (value: string | number) => string;
    cellWithDDD: (value: string | number) => string;
    generic: (value: string | number, config: IConfig) => string;
}

class ConfigFormats {
    public static config = {
        cep: {
            length: 8,
            regex: /^(\d{5})(\d{3})$/,
            mask: '$1-$2'
        },
        cpf: {
            length: 11,
            regex: /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            mask: '$1.$2.$3-$4'
        },
        cnpj: {
            length: 14,
            regex: /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            mask: '$1.$2.$3/$4-$5'
        },
        cell: {
            length: 9,
            regex: /^(\d{5})(\d{4})$/,
            mask: '$1-$2'
        },
        cellWithDDD: {
            length: 11,
            regex: /^(\d{2})(\d{5})(\d{4})$/,
            mask: '($1) $2-$3'
        }
    }
}

class Formatter implements IFormats {
    constructor() { };

    private leadingZerosValue(value: number | string, length: number): string {
        const unformattedValue = value.toString().replace(/\D/g, '');
        return `${'0'.repeat(length)}${unformattedValue}`.slice(-length);
    }

    private fn(config: IConfig, value: string | number): string {
        this.validate(config, value);
        const leadingZerosValue = this.leadingZerosValue(value, config.length);
        return leadingZerosValue.replace(config.regex, config.mask);
    }

    private validate(config: IConfig, value: string | number): void {
        const isValidLength = String(value).length === config.length;
        if (!value) { throw new Error('Prop value is required'); }
        if (!isValidLength) { throw new Error('Value length is invalid'); }
    }

    /**
     * Fomatter CEP.
     * @param {string | number} value - cep Ex: 00000000
     * @return {string} Ex: 00000-000
    */
    public cep(value: string | number): string {
        const config = ConfigFormats.config.cep;
        return this.fn(config, value);
    }

    /**
     * Fomatter CPF.
     * @param {string | number} value - cep Ex: 000000000000
     * @return {string} Ex: 000.000.000-00
    */
    public cpf(value: string | number): string {
        const config = ConfigFormats.config.cpf;
        return this.fn(config, value);
    }

    /**
     * Fomatter CNPJ.
     * @param {string | number} value - cep Ex: 00000000000000
     * @return {string} Ex: 00.000.000/0000-00
    */
    public cnpj(value: string | number): string {
        const config = ConfigFormats.config.cnpj;
        return this.fn(config, value);
    }

    /**
     * Fomatter Cel with DDD.
     * @param {string | number} value - cep Ex: 00000000000
     * @return {string} Ex: (00) 00000-0000
    */
    public cellWithDDD(value: string | number): string {
        const config = ConfigFormats.config.cellWithDDD;
        return this.fn(config, value);
    }

    /**
     * cell.
     * @param {string | number} value - cep Ex: 000000000
     * @return {string} Ex: 00000-0000
    */
    public cell(value: string | number): string {
        const config = ConfigFormats.config.cell;
        return this.fn(config, value);
    }

    /**
     * Dynamically format the value.
     * @param {string | number} value
     * @param {IConfig} config
     * @example <caption>Dynamically format.</caption>
     * const formatter = new Formatter();

       const config = {
           length: 8,
           regex: /^(\d{5})(\d{3})$/,
           mask: '$1-$2'
       }

       formatter.generic(99999999, config);
     * @returns {String} Return value format -> 99999-999.
     */
    public generic(value: string | number, config: IConfig): string {
        return this.fn(config, value);
    }
}

export default new Formatter();