import axios from 'axios'

const URL = 'http://localhost:3001/api/persons'//Change on host relocation


const getAll = () => {
    return axios.get(URL)
}

const create = newObject => {
    return axios.post(URL, newObject)
}

const remove = function(id){
    return axios.delete(`${URL}/${id}`)
}

const update = function(id, newObj){
    return axios.put(`${URL}/${id}`, newObj)
}

export default { 
    getAll: getAll,
    create: create,
    remove: remove,
    update: update,
}