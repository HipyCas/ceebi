<script setup lang="ts">
// TODO Migrate to Ionic

import { IconCopy } from '@tabler/icons-vue';
import { emit, listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { ref } from 'vue';

interface Port {
  port_name: string;
  port_type:
    | 'PciPort'
    | 'BluetoothPort'
    | 'Unknown'
    | {
        UsbPort: {
          manufacturer: string;
          pid: number;
          product: string;
          serial_number: string;
          vid: number;
        };
      };
}

const ids = ref([] as string[]);
const selectedPort = ref(null as string | null);
const availablePorts = ref([] as Port[]);

const getPorts = () =>
  invoke('get_serial_ports')
    .then((ports) => {
      availablePorts.value = ports as Array<Port>;
    })
    .catch((e) => console.error('error getting ports', e));
getPorts();

const copy = (contents: string) => {
  console.log('copy', contents);
  invoke('copy', { contents })
    .then((res) => console.log('copied!', res))
    .catch((e) => console.warn('copy error', e));
};

listen('id_scanned', ({ payload: id }: { payload: string }) => {
  console.info('received id', id);
  ids.value.push(id);
  copy(id);
});

listen('scan_closed', () => {
  loading.value = false;
  running.value = false;
});

const stop = () => {
  console.log('stuff');
  loading.value = true;
  console.info('sending close scan');
  emit('close_scan');
};

const startWithPort = (port: string) => {
  selectedPort.value = port;
  console.info('port configured:', port, 'starting scan');
  start();
};

const start = () => {
  loading.value = true;
  console.info('sending start scan ');
  invoke('start_scan', { portName: selectedPort.value })
    .then(() => (running.value = true))
    .catch((err) => console.error('error when starting scan', err))
    .finally(() => (loading.value = false)); // TODO Handle result
};

const toggle = () => (running.value ? stop() : start());
const loading = ref(false); // TODO Make true and listen for rust to tell it started
const running = ref(true);
</script>

<template>
  <template v-if="selectedPort">
    <button
      class="fixed bottom-[2vw] w-[96vw] mx-[2vw] uppercase py-3 rounded transition-all hover:shadow-sm hover:scale-[.98]"
      :class="
        running
          ? 'bg-cred-800 hover:shadow-cred-900'
          : 'bg-green-800 hover:shadow-green-900'
      "
      @click="toggle"
    >
      {{ running ? 'Stop' : 'Start' }}
    </button>
    <div class="p-4 pb-16">
      <div
        class="bg-opacity-50 bg-cblack h-screen w-screen flex flex-col gap-2 items-center justify-center fixed z-50 inset-0"
        v-show="loading"
      >
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        Stopping scan...
      </div>
      <h1 class="text-4xl font-bold my-2">
        {{ running ? 'Scanning...' : 'Scan stopped' }}
      </h1>
      <main>
        <div
          class="flex justify-between items-center px-4 py-3 bg-zinc-950 shadow-lg shadow-zinc-950 rounded-lg mb-4"
          v-for="id in ids"
        >
          {{ id }}
          <button
            class="uppercase transition-[box-shadow,background-color] shadow-none hover:shadow-md hover:shadow-cblue-400 hover:bg-cblue-800 p-1 -m-0.5 rounded"
            @click="() => copy(id)"
          >
            <IconCopy></IconCopy>
          </button>
        </div>
      </main>
    </div>
  </template>
  <template v-else>
    <div class="p-4 pb-16">
      <h1 class="text-4xl font-bold my-2">Select a scanner</h1>
      <div
        class="flex flex-col px-4 py-3 bg-cblack-950 shadow-lg shadow-cblack-950 rounded-lg mb-4"
        v-for="port in availablePorts"
        @click="startWithPort(port.port_name)"
      >
        <strong class="text-lg">{{ port.port_name }}</strong>
        {{ port.port_type }}
      </div>
    </div>
  </template>
</template>
