<template>
  <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
    <header>
      <ClientTopNav title="Consulta de talleres y microcharlas" />
    </header>
    <main class="flex flex-col flex-grow md:justify-center items-center">
      <slot></slot>
    </main>
    <ClientFooter />
  </div>
</template>
