require('dotenv').config(); // ✅ Carrega as mesmas variáveis do .env
const mongoose = require('mongoose');
const Lar = require('./src/models/Lar');

const main = async () => {
  try {
    // ✅ Usar as mesmas variáveis do database.js
    const { DB_USER, DB_PASS, DB_NAME, DB_CLUSTER1, DB_CLUSTER2 } = process.env;
    
    // ✅ Montar a mesma URI do database.js
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}${DB_CLUSTER1}/${DB_NAME}?${DB_CLUSTER2}`;
    
    console.log('🔌 Conectando ao MongoDB Atlas...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado ao MongoDB Atlas!');
    
    // Buscar todos os lares
    const lares = await Lar.find();
    console.log(`\n📊 Total de lares no banco: ${lares.length}`);
    
    if (lares.length === 0) {
      console.log('\n❌ Nenhum lar encontrado no banco de dados.');
      console.log('💡 Cadastre um lar via frontend em http://localhost:8080/cadastrar');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    // Ativar todos os lares
    console.log('\n🔄 Ativando todos os lares...');
    const result = await Lar.updateMany(
      {},
      { $set: { isActive: true } }
    );
    
    console.log(`\n✅ ${result.modifiedCount} lar(es) ativado(s) com sucesso!`);
    
    // Listar todos os lares
    const laresAtualizados = await Lar.find();
    console.log('\n📋 Lares no banco de dados:');
    console.log('─'.repeat(60));
    laresAtualizados.forEach((lar, index) => {
      console.log(`${index + 1}. ${lar.hostName} (${lar.city}, ${lar.state})`);
      console.log(`   Email: ${lar.email}`);
      console.log(`   Ativo: ${lar.isActive ? '🟢 Sim' : '🔴 Não'}`);
      console.log(`   Capacidade: ${lar.capacity} pet(s)`);
      console.log('─'.repeat(60));
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Conexão encerrada. Script finalizado!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
};

main();
