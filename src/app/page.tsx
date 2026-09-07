import { Arena } from "@/components/Arena";
import { WalletConnect } from "@/components/WalletConnect";
import { Wordmark } from "@/components/Wordmark";
import { VAULT_ETH } from "@/lib/duel";
import { eth } from "@/lib/format";
import { CHAIN, SITE, TOKEN } from "@/lib/site";

/* One page. No nav, because there is nowhere else to go — the whole product
   is a fighter, an opponent and a button. */
export default function Home() {
  return (
    <>
      <header className="mx-auto max-w-4xl px-5 sm:px-8 pt-6 flex items-center justify-between gap-4">
        <span className="text-fg">
          <Wordmark />
        </span>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="eyebrow leading-none">Vault</p>
            <p className="numeral text-sm text-accent mt-1">{eth(VAULT_ETH, 3)}</p>
          </div>
          <WalletConnect />
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-10 text-center">
        <h1 className="display text-[clamp(2.25rem,6.5vw,4rem)]">
          Two holders. <span className="text-accent">One purse.</span>
        </h1>
        <p className="mt-4 text-base text-fg-soft leading-relaxed max-w-lg mx-auto">
          Every trade of ${TOKEN.ticker} drops a fee into the vault. Connect a wallet and it draws
          your fighter — no setup, the address <em className="not-italic text-fg">is</em> the
          character. Beat another holder and you walk off with a slice of it.
        </p>
        <p className="eyebrow mt-4 sm:hidden">Vault {eth(VAULT_ETH, 3)}</p>
      </section>

      <Arena />

      <footer className="mx-auto max-w-4xl px-5 sm:px-8 pb-12 pt-8 border-t-2 border-line">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">
            {CHAIN.name} · {CHAIN.id}
          </p>
          <a
            href={SITE.social}
            target="_blank"
            rel="noreferrer noopener"
            className="eyebrow hover:text-accent transition-colors"
          >
            {SITE.handle}
          </a>
        </div>
        <p className="mt-4 text-xs text-fg-muted leading-relaxed">
          Duels are settled by chance — fighter traits, bag size and build number change nothing
          about the odds. ${TOKEN.ticker} is a speculative token; assume you can lose whatever you
          put in. Nothing here is financial advice.
        </p>
      </footer>
    </>
  );
}
