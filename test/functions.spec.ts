import { Formatter, IConfig } from './../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Formatter', () => {
    let formatter: Formatter;

    beforeEach(() => {
        formatter = new Formatter();
    })

    describe('cep formatter', () => {
        it(`Should format the CEP (00000000 => 00000-000)`, () => {
            const result = formatter.cep(99999999);
            expect(result).to.equal('99999-999');
        });
    });

    describe('cpf formatter', () => {
        it(`Should format the CPF (000000000000 => 000.000.000-00)`, () => {
            const result = formatter.cpf(99999999999);
            expect(result).to.equal('999.999.999-99');
        });
    });

    describe('cnpj formatter', () => {
        it(`Should format the CNPJ (00000000000000 => 00.000.000/0000-00)`, () => {
            const result = formatter.cnpj(99999999999999);
            expect(result).to.equal('99.999.999/9999-99');
        });
    });

    describe('cell with ddd formatter', () => {
        it(`Should format the CEL with DDD (00000000000 => (00) 00000-0000)`, () => {
            const result = formatter.cellWithDDD(99999999999);
            expect(result).to.equal('(99) 99999-9999');
        });
    });

    describe('cell formatter', () => {
        it(`Should format the CELL(000000000 => 00000-0000)`, () => {
            const result = formatter.cell(999999999);
            expect(result).to.equal('99999-9999');
        });
    });

    describe('generic formatter', () => {
        let config: IConfig;
        beforeEach(() => {
            config = {
                length: 8,
                regex: /^(\d{5})(\d{3})$/,
                mask: '$1-$2'
            }
        })
        it(`Should format the CEP dynamically`, () => {
            const result = formatter.generic(99999999, config);
            expect(result).to.equal('99999-999');
        });
    });

    describe('Should throw error', () => {
        it(`Should return error when CEP format is wrong`, () => {
            const fn = () => formatter.cep(999999);
            expect(fn).to.throw(Error, 'Value length is invalid');
        });

        it(`Should return error when CEP is empty`, () => {
            const fn = () => formatter.cep('');
            expect(fn).to.throw(Error, 'Prop value is required');
        });
    });
});