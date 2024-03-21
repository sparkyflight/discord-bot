# Nirn Proxy

Our codebase is designed to use Nirn Proxy and Gateway Proxy. This helps improve the connection between your bot and Discord's API. To do this, simply run `/usr/bin/nirn-proxy ws-proxy=ws://127.0.0.1:7851 port=7852` within a child process. Before you can run this command, you will have to run `cd src/nirn-proxy` and `make`. This will compile the proxy into a Binary executable. Once it's finished compiling, put the Binary executable which should be called `nirn-proxy` into the `/usr/bin` directory. You can do this by running `cp -r nirn-proxy /usr/bin` (you will need to run this command with sudo or with elevated permissions).

# Gateway Proxy

Our codebase is designed to use Nirn Proxy and Gateway Proxy. This helps improve the connection between your bot and Discord's API. Once the Nirn Proxy is turned on, you can turn on the gateway proxy! To do this, simply execute `./gateway-proxy` in the `src/gateway-proxy` directory within a child process. Before you can execute that command, you will have to execute `cd src/gateway-proxy` and `make`. Just like nirn proxy, this should create a Binary executable. However, before the Gateway Proxy can be used. You have to create a `config.json` file. An example configuration example file, can be found at `src/gateway-proxy/config.example.json`.

# Discord Bot

Once the Nirn Proxy and Gateway Proxy are both running, you can now start the Discord Bot with ease! Just run `npm run tsc` and `npm start`. However, before the bot can be used; it has to have a config file. Simply create a `.env` file based off the `.env.example`. Once that is done, you have to generate the PrismaJS client. To do this, run `npm run database:push`.

# Don't want to use proxies?

If you don't want to use our recommended proxies, simply set the `PROXY_DISABLED` parameter in the `.env` file to `true`
