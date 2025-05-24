// تحسين التعامل مع أجهزة البصمة
import { ZKLib } from "zklib"

export interface FingerprintDevice {
  ip: string
  port: number
  password?: string
  timeout?: number
}

export class FingerprintService {
  private device: FingerprintDevice
  private zk: ZKLib

  constructor(device: FingerprintDevice) {
    this.device = device
    this.zk = new ZKLib({
      ip: device.ip,
      port: device.port,
      inport: device.port,
      timeout: device.timeout || 5000,
      password: device.password || 0,
    })
  }

  // إضافة معالجة الأخطاء وإعادة المحاولة
  async connect(): Promise<boolean> {
    try {
      let retries = 3
      while (retries > 0) {
        try {
          const connected = await this.zk.connect()
          if (connected) {
            console.log(`Connected to device at ${this.device.ip}:${this.device.port}`)
            return true
          }
        } catch (err) {
          console.error(`Connection attempt failed (${retries} retries left):`, err)
        }
        retries--
        // انتظار قبل إعادة المحاولة
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      throw new Error(`Failed to connect to device at ${this.device.ip}:${this.device.port} after multiple attempts`)
    } catch (error) {
      console.error("Error connecting to fingerprint device:", error)
      throw error
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      await this.zk.disconnect()
      console.log(`Disconnected from device at ${this.device.ip}:${this.device.port}`)
      return true
    } catch (error) {
      console.error("Error disconnecting from fingerprint device:", error)
      throw error
    }
  }

  async getAttendance(): Promise<any[]> {
    try {
      await this.connect()
      const attendance = await this.zk.getAttendance()
      await this.disconnect()
      return attendance || []
    } catch (error) {
      console.error("Error getting attendance from fingerprint device:", error)
      throw error
    }
  }

  // إضافة دوال جديدة للتعامل مع الموظفين
  async getUsers(): Promise<any[]> {
    try {
      await this.connect()
      const users = await this.zk.getUsers()
      await this.disconnect()
      return users || []
    } catch (error) {
      console.error("Error getting users from fingerprint device:", error)
      throw error
    }
  }

  async setUser(userId: number, name: string, password = "", cardno = ""): Promise<boolean> {
    try {
      await this.connect()
      const result = await this.zk.setUser(userId, name, password, "", 0, cardno)
      await this.disconnect()
      return result
    } catch (error) {
      console.error("Error setting user on fingerprint device:", error)
      throw error
    }
  }
}
