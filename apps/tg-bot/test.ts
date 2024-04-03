/* eslint-disable @typescript-eslint/ban-types */
import {performance} from 'node:perf_hooks'

// Генерация тестовых данных
const generateTestData = (count: number) => {
  const result = []
  for (let i = 0; i < count; i++) {
    const testData = []
    for (let i = 0; i < 1000; i++) {
      testData.push({
        chatId: String(Math.floor(Math.random() * 1000)),
        messages: [
          {
            args: {
              chatId: Math.floor(Math.random() * 1000),
              text: 'Test message',
              arguments: {
                keyboard: {
                  type: 'standard',
                },
              },
            },
            type: 'send_message',
          },
        ],
      })
    }
    result.push(testData)
  }
  return result
}

// Копирование объектов с использованием JSON.stringify и JSON.parse
const copyWithJSON = (data: object) => JSON.parse(JSON.stringify(data))

// Копирование объектов с использованием structuredClone
const copyWithStructuredClone = (data: object) => {
  return structuredClone(data)
}
const testCount = 1e3
// Замер времени выполнения функции и вывод результата
const measurePerformance = (copyFunction: Function) => {
  const testData = generateTestData(testCount)
  const startTime = performance.now()
  for (const data of testData) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const copiedData = copyFunction(data)
  }
  const endTime = performance.now()
  console.log(`Копирование заняло ${endTime - startTime} миллисекунд`)
}

// Замер производительности для каждого метода копирования

console.log('\nПроизводительность копирования с использованием structuredClone:')
measurePerformance(copyWithStructuredClone)

console.log('Производительность копирования с использованием JSON.stringify и JSON.parse:')
measurePerformance(copyWithJSON)
