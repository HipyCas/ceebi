<template>
  <h1 class="text-3xl font-black tracking-wide">Crea una nueva cuenta</h1>
  <p class="mb-4">Regístrate en la plataforma</p>
  <FormKit type="form" submit-label="Registrarse" @submit="signup">
    <FormKit
      type="text"
      name="token"
      label="Clave de registro"
      help="Una clave otorgada por un administrador o desarrollador necesaria para el registro"
    ></FormKit>
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
    <FormKit
      type="password"
      name="password_confirm"
      label="Confirmar contraseña"
      validation="required|confirm"
      validation-visibility="live"
      prefix-icon="lock"
      suffix-icon="eye"
      @suffix-icon-click="switchPasswordView"
    ></FormKit>
  </FormKit>
</template>

<script setup lang="ts">
const switchPasswordView = (node: any, e: CustomEvent) => {
  node.props.suffixIcon =
    node.props.suffixIcon === 'eye' ? 'eye-closed' : 'eye';
  node.props.type = node.props.type === 'password' ? 'text' : 'password';
};

const signup = async (fields: {
  email: string;
  password: string;
  token?: string;
}) => {
  await $fetch('/api/auth/signup', {
    method: 'POST',
    body: fields,
    redirect: 'manual', // ignore redirect responses
  });
  await navigateTo('/admin');
};
</script>
