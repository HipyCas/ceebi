<template>
  <h1 class="text-3xl font-black tracking-wide">Accede a tu cuenta</h1>
  <p class="mb-4">Accede a la plataforma</p>
  <FormKit type="form" submit-label="Iniciar sesión" @submit="login">
    <FormKit
      type="email"
      name="email"
      label="Correo electrónico"
      validation="required|email"
      validation-visibility="live"
    ></FormKit>
    <FormKit
      type="password"
      name="password"
      label="Contraseña"
      validation="required"
      validation-visibility="live"
      prefix-icon="lock"
      suffix-icon="eye"
      @suffix-icon-click="switchPasswordView"
    ></FormKit>
  </FormKit>
</template>

<script setup lang="ts">
const route = useRoute();

const switchPasswordView = (node: any, e: CustomEvent) => {
  node.props.suffixIcon =
    node.props.suffixIcon === 'eye' ? 'eye-closed' : 'eye';
  node.props.type = node.props.type === 'password' ? 'text' : 'password';
};

const login = async (fields: { email: string; password: string }) => {
  await $fetch('/api/auth/login', {
    method: 'POST',
    body: fields,
    redirect: 'manual',
    query: route.query,
  });
  console.log('logged in!');
  await navigateTo((route.query.next as string) || '/admin');
};
</script>
