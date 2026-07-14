import PocketBase from 'pocketbase';

// URL padrão do PocketBase em desenvolvimento
const pb = new PocketBase('http://127.0.0.1:8090');

// Habilita cancelamento automático das requisições
pb.autoCancellation(false);

export default pb;