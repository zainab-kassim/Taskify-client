import axios from 'axios'
import React, { useEffect } from 'react'

export default function Delete({ id }: { id: string }){

     
    async function DeleteTask(id: string) {
        try {
            await axios.delete(`http://localhost:4000/api/task/${id}/delete`)
               
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <button onClick={() => { DeleteTask(id) }}>delete</button>
    )
};

