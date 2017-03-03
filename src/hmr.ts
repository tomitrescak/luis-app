const customizedHMRPlugin = {
    hmrUpdate: ({ type, path, content }: any) => {
        if (type === 'js') {
            const isModuleStateful = (path) => statefulModuleCheck(path);

            /** If a stateful module has changed reload the window */
            if (isModuleStateful(path)) {
                window.location.reload();
            }

            /** Otherwise flush the other modules */
            FuseBox.flush(function (fileName) {
                return !isModuleStateful(fileName);
            });

            /** Patch the module at give path */
            FuseBox.dynamic(path, content);

            /** Re-import / run the mainFile */
            if (FuseBox.mainFile) {
                try {
                    FuseBox.import(FuseBox.mainFile);
                } catch (e) {
                    // in case if a package was not found
                    // It probably means that it's just not in the scope
                    if (typeof e === 'string') { // a better way but string?!
                        if (/not found/.test(e)) {
                            window.location.reload();
                        }
                    }
                    console.error(e);
                }

            }

            /** We don't want the default behavior */
            return true;
        }
        return false;
    }

};

/** Only register the plugin once */
let alreadyRegistered = false;

/** Current names of stateful modules */
let statefulModuleCheck: (moduleName: string) => boolean = () => false;

/**
 * Registers given module names as being stateful
 * @param isStateful for a given moduleName returns true if the module is stateful
 */
export const setStatefulModules = (isStateful: (moduleName: string) => boolean) => {
    if (!alreadyRegistered) {
        alreadyRegistered = true;
        FuseBox.addPlugin(customizedHMRPlugin);
    }
    statefulModuleCheck = isStateful;
};