<script setup>
import { ref } from 'vue';
import { useStore } from '@/stores/store.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import router from '@/router/index.js';

const store = useStore();
const email = ref('');
const password = ref('');
const hasError = ref(false);

function login() {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(data => {
      store.uid = data.user.uid;
      router.push('/data');
    })
    .catch(error => {
      hasError.value = true;
      router.push('/login');
      console.log('Login Error', error);
    });
}

function loginAsGuest() {
  store.uid = 'testuser';
  router.push('/data');
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto mt-8 p-5 bg-white rounded">
      <div class="text-2xl mb-4">Login</div>
      <p
        v-if="hasError"
        class="errors"
      >
        Login fehlgeschlagen. Bitte überprüfen Sie E-Mail und Passwort oder fahren Sie als Gast fort.
      </p>
      <p>
        <input
          type="text"
          placeholder="E-Mail"
          v-model="email"
        />
      </p>
      <p>
        <input
          type="password"
          placeholder="Password"
          v-model="password"
        />
      </p>
      <button
        @click="login"
        class="button w-full"
      >
        Einloggen
      </button>
    </div>

    <div class="max-w-md mx-auto mt-8 p-5 bg-white rounded">
      <div class="text-2xl mb-4">Keine Zugangsdaten?</div>
      <p>Interessierte Besucher können sich das Projekt über den Gastzugang ansehen.</p>
      <button
        @click="loginAsGuest"
        class="button w-full"
      >
        Als Gast fortfahren
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.errors {
  @apply mb-4
      p-5
      text-red-700
      border
      border-red-700
      bg-red-100
      rounded;
}
</style>
