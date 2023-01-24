export function convertHoursToMinute (hourString: string) {

    const [hour, minute] = hourString.split(":").map(Number) /*.map(Number), transforma em numeros*/
    return (hour*60)+minute

}

export function convertMinuteToHours (time:number) {

    const hours = Math.floor(time/60)
    const minute = time % 60;

    return `${hours}:${minute}`
}