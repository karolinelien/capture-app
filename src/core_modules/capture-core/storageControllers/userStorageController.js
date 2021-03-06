// @flow
import { StorageController, IndexedDBAdapter } from 'capture-core-utils/storage';
import { getCurrentUser } from '../d2/d2Instance';
import { userStores } from './stores/index';

function getStorageName(mainStorageName: string) {
    const user = getCurrentUser();
    return mainStorageName + user.id;
}

function getStores() {
    const userStoresList = Object.keys(userStores).map(key => userStores[key]);
    return userStoresList;
}

function createStorageController(
    mainStorageController: StorageController,
) {
    const storageName = getStorageName(mainStorageController.name);
    const appCacheVersion = mainStorageController.version;
    const stores = getStores();
    const storageController =
        new StorageController(
            storageName,
            appCacheVersion,
            {
                Adapters: [mainStorageController.adapterType],
                objectStores: stores,
            },
        );
    return storageController;
}

async function initUserControllerAsync(mainStorageController: StorageController) {
    const userStorageController =
        createStorageController(mainStorageController);

    let upgradeTempData;
    await userStorageController
        .open(
            storage => storage
                .get(userStores.REDUX_PERSIST, 'reduxPersist:offline')
                .then((data) => {
                    upgradeTempData = data;
                }),
            (storage) => {
                if (!upgradeTempData) {
                    return null;
                }
                return storage
                    .set(userStores.REDUX_PERSIST, upgradeTempData);
            },
            (objectStore, adapter) => {
                if (adapter === IndexedDBAdapter) {
                    if (objectStore.name === userStores.CATEGORY_OPTIONS) {
                        objectStore.createIndex('category', 'categories', { multiEntry: true });
                    }
                }
            },
        );
    return userStorageController;
}

export default initUserControllerAsync;
