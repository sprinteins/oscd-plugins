help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

core: _install
	pnpm -C ./packages/core run test:watch

uilib: _install ## Start UI-Lib in dev mode
	pnpm -C ./packages/uilib run dev

communication-explorer: _install ## Start the communication explorer plugin in dev mode
	pnpm -C ./packages/plugins/communication-explorer run build:watch

network-explorer: _install ## Start the network explorer plugin in dev mode
	pnpm -C ./packages/plugins/network-explorer run build:watch

documentation: _install ## Start the documentation plugin in dev mode
	pnpm -C ./packages/plugins/documentation run build:watch

type-switcher: _install ## Start the type switcher plugin in dev mode
	pnpm -C ./packages/plugins/type-switcher run build:watch

fix: _install ## Fix eslint errors
	pnpm turbo fix
	
uilib-tests: _install
	(cd ./packages/uilib ; pnpm test:unit)

plugins: communication-explorer # shortcut

_install:
	pnpm install

start-scd:
	bash ./_scripts/run-openscd.sh