import React, { useState } from 'react';
import './App.css';
import lupa from './assets/images/lupa.png';
import deletar from './assets/images/xis.svg';
import editar from './assets/images/lapis.svg';

function App() {
  // Estado para armazenar a lista de tarefas
  const [tasks, setTasks] = useState([]);
  // Estado para armazenar o texto da nova tarefa
  const [newTask, setNewTask] = useState('');
  // Estado para controlar a exibição do modal de adicionar/editar tarefas
  const [showModal, setShowModal] = useState(false);
  // Estado para armazenar o índice da tarefa que está sendo editada
  const [editTaskIndex, setEditTaskIndex] = useState(null);

  // Função para formatar a data no formato desejado
  function formatDate(date) {
    const daysOfWeek = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const dayOfWeek = daysOfWeek[date.getDay()]; // Obtém o dia da semana
    const day = date.getDate(); // Obtém o número do dia do mês
    const month = months[date.getMonth()]; // Obtém o mês

    // Retorna a data formatada como uma string com HTML para estilizar o número do dia
    return `${dayOfWeek}, <span class="date-day">${day}</span> de ${month}`;
  }

  const today = new Date(); // Obtém a data atual

  // Função para alternar a visibilidade do modal e definir o índice da tarefa para edição
  const toggleModal = (id = null) => {
    setShowModal(!showModal);
    setEditTaskIndex(id);
    setNewTask(id !== null ? tasks.find((task) => task.id === id).text : '');
  };

  // Função para adicionar ou editar uma tarefa
  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        id: Date.now(), // Cria um identificador único para a nova tarefa
        text: newTask,
        completed: false,
      };
      if (editTaskIndex !== null) {
        // Edita a tarefa existente
        const updatedTasks = tasks.map((task) =>
          task.id === editTaskIndex ? { ...task, text: newTask } : task
        );
        setTasks(updatedTasks);
      } else {
        // Adiciona a nova tarefa
        setTasks([...tasks, newTaskItem]);
      }
      toggleModal(); // Fecha o modal após adicionar ou editar
    }
  };

  // Função para deletar uma tarefa
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Função para alternar o status de conclusão de uma tarefa
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Estado para armazenar o termo de busca
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra as tarefas com base no termo de busca
  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="task-container">
        {/* Exibe a data formatada com HTML */}
        <h1 dangerouslySetInnerHTML={{ __html: formatDate(today) }} />
        <div className="search-bar">
          {/* Ícone de pesquisa */}
          <img src={lupa} alt='Pesquisar' className='search-icon' />
          <input
            type="text"
            placeholder="Procurar tarefa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
          />
        </div>
        {/* Renderiza a lista de tarefas filtradas */}
        {filteredTasks.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)} // Alterna o status de conclusão
            />
            <span>{task.text}</span>
            <div className="task-actions">
              {/* Botão para editar a tarefa */}
              <button className="edit-btn" onClick={() => toggleModal(task.id)}>
                <img src={editar} alt="Editar" className="action-icon" />
              </button>
              {/* Botão para deletar a tarefa */}
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                <img src={deletar} alt="Deletar" className="action-icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Botão para adicionar uma nova tarefa */}
      <button className="new-task-btn" onClick={() => toggleModal()}>Nova tarefa</button>

      {/* Modal para adicionar ou editar uma tarefa */}
      {showModal && (
        <div className="modal-background">
          <div className="modal-container">
            <h2>{editTaskIndex !== null ? 'Edite sua tarefa' : 'Descreva sua tarefa'}</h2>
            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)} // Atualiza o texto da tarefa
              placeholder="Exemplo de descrição">
            </textarea>
            <button className="confirm-btn" onClick={addTask}>
              {editTaskIndex !== null ? 'Salvar alterações' : 'Confirmar tarefa'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
