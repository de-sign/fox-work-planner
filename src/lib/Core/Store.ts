// Imports
import type { TObject, TFlag } from './Type';
import { EVENT_NAME, PROPERTY_NAME } from './Constants';
import { CONFIG } from '../Core/Config';

import EventEmitter from 'eventemitter3';


/**
 * Store options supplied to constructor.
 */
export interface IStoreOptions {
    aStorableKeys?: string[]
}


/**
 * Store Manager class.
 * 
 * Use for store data that can be transmitted between components.
 * If Key is defined in aStorableKeys, the manager stores data on LocalStorage.
 * @class
 */

class Store extends EventEmitter {

    /** Singleton instance. **/
    private static _oInstance: Store;
    /** Data saved by the manager. **/
    private _oData: TObject = {};
    /** Key stored in LocalStorage when they are set. */
    private _oStorableKeys: TFlag = {};
    
    
    /** Constructor */
    private constructor(oStoreOptions?: IStoreOptions) {

        super();

        // Définie les cléfs à sauvegarder via les options
        oStoreOptions?.aStorableKeys?.forEach( sKey => {
            this._oStorableKeys[ Store._getKey(sKey) ] = true;
        } );

        // Récupère les datas sauvegardées
        this._recover();
    }

    /** Instance getter */
    public static get oInstance(): Store {
        if (!Store._oInstance) {
            Store._oInstance = new Store( {
                aStorableKeys: CONFIG.STORE_STORABLE_KEYS
            } );
        }

        return Store._oInstance;
    }

    /** Destructor */
    public destroy(): void {
        // Remove listeners
        this.removeAllListeners();
    }

    /**
     * Define value of Key in Data.
     * If Key is defined in aStorableKeys, the manager stores data on LocalStorage.
     */
    public set(sKey: string, uValue: any): Store {

        const sStoreKey = Store._getKey(sKey);
        this._oData[sStoreKey] = uValue;

        // Sauvegarde si défini via options
        if( this._oStorableKeys[sStoreKey] ){
            localStorage.setItem( sStoreKey, JSON.stringify(uValue) );
        }

        // Trigger
        this.emit(EVENT_NAME.STORE_SET, sKey, uValue);
        this.emit(EVENT_NAME.STORE_UPDATE, true, sKey, uValue);

        return this;
    }

    /** Return if Key has value stored in Data. */
    public has(sKey: string): Boolean {
        return !!this._oData[ Store._getKey(sKey) ];
    }

    /** Return value of Key stored in Data. */
    public get(sKey: string): any {
        return this._oData[ Store._getKey(sKey) ];
    }

    /**
     * Remove Key stored in Data and return his value.
     * If Key is defined in aStorableKeys, the manager remove data on LocalStorage.
     */
    public remove(sKey: string): any {
        const sStoreKey = Store._getKey(sKey),
            uValue = this._oData[sStoreKey];

        delete this._oData[sStoreKey];

        // Supprime si défini via options
        if( this._oStorableKeys[sStoreKey] ){
            delete this._oStorableKeys[sStoreKey];
            localStorage.removeItem(sStoreKey);
        }

        // Trigger
        this.emit(EVENT_NAME.STORE_REMOVE, sKey, uValue);
        this.emit(EVENT_NAME.STORE_UPDATE, false, sKey, uValue);
        
        return uValue;
    }

    /** Define Key in aStorableKeys, set value if given. */
    public setStorableKey(sKey: string, uValue?: any): Store {
        
        const sStoreKey = Store._getKey(sKey);
        this._oStorableKeys[sStoreKey] = true;

        // Enregistre si valeur tranmise
        if( uValue !== undefined ){
            this.set(sStoreKey, uValue);
        }

        return this;
    }

    private static _getKey(sKey: string): string {
        return CONFIG.STORE_PREFIX_KEY + '-' + sKey;
    }

    /** Recover data stores on LocalStorage. */
    private _recover(): void {
        for( let nIndex = 0; nIndex < localStorage.length; nIndex++ ){
            const sStoreKey = localStorage.key(nIndex);

            if(sStoreKey && sStoreKey.indexOf(CONFIG.STORE_PREFIX_KEY) == 0){
                const sData = localStorage.getItem(sStoreKey);

                this._oData[sStoreKey] = sData ? JSON.parse(sData) : null;
                this._oStorableKeys[sStoreKey] = true;
            }
        }
    }
}

export default Store.oInstance;