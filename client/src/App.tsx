import Layout from "./components/Layout";
import { Route } from "wouter";
import Transfer from "./pages/transfer";
import Contacts from "./pages/contacts";
import History from "./pages/history";
import useMetamask from "./hooks/useMetamask";
import { wallet } from "./signals";
import { metamaskExists } from "./constants";
import Dialog from "./components/Dialog";
import metamaskLogo from "./assets/metamask.svg";
import { Toaster } from "react-hot-toast";
import PendingTransaction from "./components/PendingTransaction";

function App() {
  const { providerExists, loadWallet } = useMetamask();

  return !metamaskExists ? (
    <Dialog.Root open>
      <Dialog.Content>
        <Dialog.Title className="mb-1">Oops, Metamask is not installed!</Dialog.Title>
        <p>Please install Metamask extension and reload the page to use this app.</p>
        <div className="mt-4 text-center">
          <a href="https://metamask.io/" target="_blank">
            <button className="rounded-2xl border-2 border-gray-800 px-4 py-3 hover:shadow-[4px_4px_0px_rgb(31_41_55)]">
              <img className="w-48" src={metamaskLogo} />
            </button>
          </a>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  ) : providerExists === undefined ? (
    <div>loading..........</div>
  ) : !providerExists ? (
    <Dialog.Root open>
      <Dialog.Content>
        <Dialog.Title className="mb-1">Oops, there are no injected providers!</Dialog.Title>
        <p>We cannot find any injected providers to the Metamask extension.</p>
      </Dialog.Content>
    </Dialog.Root>
  ) : !wallet.value || wallet.value.accounts.length === 0 ? (
    <Dialog.Root open>
      <Dialog.Content>
        <Dialog.Title className="mb-1">Connect to Metamask</Dialog.Title>
        <p>Please press the button below to connect to Metamask.</p>
        <div className="mt-4 text-center">
          <button
            className="rounded-2xl border-2 border-gray-800 px-4 py-3 hover:shadow-[4px_4px_0px_rgb(31_41_55)]"
            onClick={() => {
              loadWallet();
            }}
          >
            <img className="w-48" src={metamaskLogo} />
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  ) : (
    <>
      <Toaster containerClassName="z-50" position="bottom-center" reverseOrder={false} />
      <Layout>
        <Route path="/" component={Transfer} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/history" component={History} />
        <PendingTransaction />
      </Layout>
    </>
  );
}

export default App;
