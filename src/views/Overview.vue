<script setup>
import eslintLogo from '@/assets/images/eslint-logo.svg';
import tailwindcssLogo from '@/assets/images/tailwindcss-logo.svg';
import vuejsLogo from '@/assets/images/vuejs-logo.svg';
import vitejsLogo from '@/assets/images/vitejs-logo.svg';
import vitestLogo from '@/assets/images/vitest-logo.svg';
import firebaseLogo from '@/assets/images/firebase-logo.svg';
import piniaLogo from '@/assets/images/pinia-logo.svg';
import prettierLogo from '@/assets/images/prettier-logo.svg';
import invoiceBill from '@/assets/images/invoice-bill.svg';
import piggyBank from '@/assets/images/piggy-bank.svg';
</script>

<template>
  <div>
    <div class="max-w-4xl m-auto px-3 py-20 text-center text-xl">
      <div class="headline">Was ist das hier?</div>
      <p>
        BillBird ist ein privates Vue3-Testprojekt zum Verwalten meiner eigenen Finanzen. Es ist Programmierspielwiese und nützliches Tool gleichermaßen und ausschließlich für den Eigengebrauch und
        als Showcase für Bewerbungen gedacht.
      </p>

      <p>Das Tool soll mir einen besseren Überblick über meine Ersparnisse geben und dabei helfen, monatlich die nötigen Beträge für Jahres- oder Quartalsrechnungen zurückzulegen.</p>

      <p>Das Projekt befindet sich noch im Aufbau.</p>
    </div>

    <div class="features px-3 py-20 bg-slate-300">
      <div class="max-w-4xl m-auto">
        <div class="headline">Features</div>
        <div class="sm:flex sm:justify-center sm:gap-12">
          <div class="text-center mb-12 sm:mb-0">
            <img
              :src="invoiceBill"
              alt="Rechnung auf Computerbildung"
            />
            <div class="text-xl font-black mb-4">Rechnung</div>
            <p>Wiederkehrende Rechnungen mit einem Intervall anlegen und monatlichen Sparbetrag berechnen lassen.</p>
          </div>
          <div class="text-center">
            <img
              :src="piggyBank"
              alt="Sparschwein"
            />
            <div class="text-xl font-black mb-4">Sparplan</div>
            <p>Mit einem Sparplan können feste Sparziele verfolgt und festgelegte Beträge gespart werden.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="tech-stack px-3 py-20 bg-slate-800">
      <div class="max-w-4xl m-auto">
        <div class="headline text-white mb-20">Technologie-Stack</div>
        <ul class="grid gap-20 grid-cols-2 md:grid-cols-4 items-center">
          <li>
            <a
              href="https://eslint.org/"
              title="ESLint"
            >
              <img
                :src="eslintLogo"
                alt="Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://tailwindcss.com/"
              title="Tailwind CSS"
            >
              <img
                :src="tailwindcssLogo"
                alt="Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://vuejs.org/"
              title="Vue.js"
            >
              <img
                :src="vuejsLogo"
                alt="Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://vitejs.dev/"
              title="Vite"
            >
              <img
                :src="vitejsLogo"
                alt="Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://vitest.dev/"
              title="Vitest"
            >
              <img
                :src="vitestLogo"
                alt="Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://firebase.google.com/firebase"
              title="Firebase"
            >
              <img
                :src="firebaseLogo"
                alt="Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://pinia.vuejs.org/"
              title="Pinia"
            >
              <img
                :src="piniaLogo"
                alt="Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://prettier.io/"
              title="Prettier"
            >
              <img
                :src="prettierLogo"
                alt="Logo"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.headline {
  @apply w-full text-4xl font-black mb-10 text-center md:text-6xl;
}

.features {
  img {
    @apply max-w-[150px] max-h-[150px] w-full h-full m-auto mb-4;
  }
}

.tech-stack {
  img {
    @apply max-w-[120px] max-h-[120px] w-full h-full m-auto;
  }
}
</style>
