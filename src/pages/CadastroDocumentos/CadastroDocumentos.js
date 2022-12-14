import './index.css'
import { useState } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import axios from "axios";



function CadastroDocumentos() {
  const api = axios.create({
    baseURL: "https://localhost:7020/Documento"
  })

  const [formValues, setFormValues] = useState({});
  const [code, setCode] = useState();
  const [title, setTitle] = useState();
  const [process, setProcess] = useState();
  const [category, setCategory] = useState();
  const [file, setFile] = useState(null);
  const fileListRef = ref(storage, 'uploaddocuments/');

  const acceptedFormats = ["pdf", "doc", "docx", "xls", "xlsx"]




  const handleSubmit = async () => {
    if (!code || !title || !process || !category || !file) {
      alert("Tem campos preenchidos incorretamente!")
      return

    }
    let extension = file.name.split('.').pop()
    if (!acceptedFormats.includes(extension)) {
      alert("Formato de arquivo não aceito")
      return 
    }
    setFormValues({
      code: code,
      title: title,
      process: process,
      category: category
    })
    if (file == null) return
    const fileRef = ref(storage, `uploaddocuments/${code}`)
    await uploadBytes(fileRef, file)
    alert("Cadastro realizado com sucesso!")

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(formValues)
    };
    const info = await fetch('https://localhost:7020/Documento', requestOptions)
    console.log('resp', info.status)


  }


  return (
    <div className='main-container'>
      <h1 className='Cadastrar'>Cadastrar Documentos</h1>
      <input type="number" name="code" placeholder="Código" onChange={(e) => setCode(e.target.value)} />
      <input type="text" name="title" placeholder="Título" onChange={(e) => setTitle(e.target.value)} />

      <select name="process" onChange={(e) => setProcess(e.target.value)} value={process}>
        <option>Processos</option>
        <option value="processo1">Processo 1</option>
        <option value="processo2">Processo 2</option>
        <option value="processo3">Processo 3</option>
      </select>

      <input type="text" name="category" placeholder="Categoria" onChange={(e) => setCategory(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />


      <button type="submit" onClick={handleSubmit}>Enviar</button>
    </div>
  );
}


export default CadastroDocumentos;
