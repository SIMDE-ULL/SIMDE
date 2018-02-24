export const NEXT_REORDER_BUFFER_MAPPER_CYCLE = 'NEXT_REORDER_BUFFER_MAPPER_CYCLE';

export function nextReorderBufferMapperCycle(data) {
    console.log(data);
    return {
        type: NEXT_REORDER_BUFFER_MAPPER_CYCLE,
        value: data.map(element => mapReorderBufferMapperData(element))
    }
}

function mapReorderBufferMapperData(data): any {
    let newState = { content: data, show: true, open: false };

    // Add show data
    // this.show.forEach(e => {
    //     newState.content.push({ index: e, value: data[e] });
    // });
    return newState;
}