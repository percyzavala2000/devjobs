import mongoose from 'mongoose';

const conexionDB=async()=>{

    try {
        await mongoose.connect(process.env.MONGO_DB_DEVJOBS, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        });
        console.log('Se conecto a base de Datos');
        
        
    } catch (error) {
        console.log('Error al conectarse',error); 
    }

    
};

export default conexionDB;