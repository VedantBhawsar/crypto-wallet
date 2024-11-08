import axios from 'axios'

class EthApis {
  ethApi: string = 'https://eth-mainnet.g.alchemy.com/v2/SJqVZ2UR7aN6Egap0f-eIj4ME4iMe_k6'

  getResponse = async (payload: any) => {
    try {
      const { data } = await axios.post(this.ethApi, payload)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  getBalance = async (walletAddress: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [walletAddress],
    }
    return this.getResponse(payload)
  }

  getTransaction = async (signature: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [signature],
    }
    return this.getResponse(payload)
  }

  getAccountInfo = async (walletAddress: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getAccountInfo',
      params: [
        'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg',
        {
          encoding: 'base58',
        },
      ],
    }

    return this.getResponse(payload)
  }

  getTransactionCount = async (walletAddress: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransactionCount',
      params: [walletAddress],
    }
    return this.getResponse(payload)
  }
}

export default new EthApis()
