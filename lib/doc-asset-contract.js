/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DocAssetContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        

        /*
        {
                entitytype: 'L',
                uen: 'R6666666',
                entity: 'SoLove',
                sectoradmin: 'Need more sleep',
                Address: '55 Jalan Bukit Merah',
            },
            */

        const _documents = [
            {
                IDPassport:'S9012344D',
                uen: 'T123456',    
                incorporationDate: '05/05/2020',    
                PersonInCharge: 'Tan Ah Kow',
                address:'18 Gombak Ave',
                //charityStatus:'Y',
                //picStatus:'',
                
            },
            {
                IDPassport:'G7012388J',
                uen: 'P3998293',    
                incorporationDate: '12/8/2019',    
                PersonInCharge: 'Lim Ah Peh',
                address:'18 Gombak Ave',
                //charityStatus:'Y',
                //picStatus:'N',
            },
            {
                IDPassport:'T8055388Z',
                uen: '',    
                incorporationDate: '15/3/2021',    
                PersonInCharge: 'Lim Ah Peh',
                address:'36 Pasir Ris Ave 5',
                //charityStatus:'',
                //picStatus:'',
            },
        ];


        for (let i = 0; i < _documents.length; i++) {
            _documents[i].docType = 'UEN';
            await ctx.stub.putState('REF'+ i, Buffer.from(JSON.stringify(_documents[i])));
            console.info('Added <--> ', _documents[i]);
        }
    
        console.info('============= END : Initialize Ledger ===========');
    }

    
    async docAssetExists(ctx, docAssetId) {
        console.info('============= START : docAssetExists ===========');
        const buffer = await ctx.stub.getState(docAssetId);
        if (!buffer || buffer.length === 0) {
            //throw new Error(`${docAssetId} does not exist`);
            return false;
        }
        // console.log(buffer.toString());
        console.info('============= END : docAssetExists ===========');
        return (!!buffer && buffer.length > 0);
    }
    
//    async createDocAsset(ctx, docAssetId, value) {
    async createDocAsset(ctx, docAssetId, IDPassport, uen, incorporationDate, PersonInCharge, address) {
        console.info('============= START : Create DocAsset ===========');
        const _document = {
            IDPassport,           
            uen,
            incorporationDate,
            PersonInCharge,
            address,
            docType: 'UEN',
        };

/*        const exists = await this.docAssetExists(ctx, docAssetId);
        if (!exists) {
            throw new Error(`The doc asset ${docAssetId} already exists`);
        }
        */
        //const asset = { value };
        const buffer = Buffer.from(JSON.stringify(_document));
        await ctx.stub.putState(docAssetId, buffer);
        console.info('============= END : Create DocAsset ===========');
    }

    async readDocAsset(ctx, docAssetId) {
        const exists = await this.docAssetExists(ctx, docAssetId);
        if (!exists) {
            throw new Error(`The doc asset ${docAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(docAssetId);
        const asset = JSON.parse(buffer.toString());
        console.info(`===========END readDocAsset==============`)
        return asset;
    }

    // async updateUENDocAsset
    // async updatecharityStatusDocAsset
    // async updatepicStatusDocAsset

    async updateDocAsset(ctx, docAssetId, newUEN) {
        console.info('============= START : updateDocAsset ===========');

        //const _docAsset = await this.docAssetExists(ctx, docAssetId);
        const _docAsset = await ctx.stub.getState(docAssetId);
        if (!_docAsset || _docAsset.length === 0) {
            throw new Error(`The doc asset ${docAssetId} does not exist`);
        }
        
        const _document = JSON.parse (_docAsset.toString());
        _document.uen = newUEN;
        //asset.charityStatus = charityStatus;
        //asset.picStatus = picStatus;
        const buffer = Buffer.from(JSON.stringify(_document));
        await ctx.stub.putState(docAssetId, buffer);

        console.info('============= END : updateDocAsset ===========');
    }

    async deleteDocAsset(ctx, docAssetId) {
        console.info('============= START : deleteDocAsset ===========');

        const exists = await this.docAssetExists(ctx, docAssetId);
        if (!exists) {
            throw new Error(`The doc asset ${docAssetId} does not exist`);
        }
        await ctx.stub.deleteState(docAssetId);

        console.info('============= END : deleteDocAsset ===========');

    }

}

module.exports = DocAssetContract;
