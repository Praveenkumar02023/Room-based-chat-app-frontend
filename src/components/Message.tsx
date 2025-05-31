export const Message = (props : {
    message : string
})=>{

    return <div className='p-2 rounded-sm bg-gray-500 mt-2 self-start'>
                 {props.message}
            </div>
}