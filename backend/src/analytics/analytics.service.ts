import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {}

  async getStats(user: User) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalBookings, dailyBookings, revenueResult] = await Promise.all([
        this.bookingRepository.count({ where: { shopId: user.shopId } }),
        this.bookingRepository.count({ 
            where: { 
                shopId: user.shopId, 
                appointmentDate: MoreThanOrEqual(today) 
            } 
        }),
        this.bookingRepository
            .createQueryBuilder('booking')
            .select('SUM(booking.totalPrice)', 'total')
            .where('booking.shopId = :shopId', { shopId: user.shopId })
            .andWhere('booking.status = :status', { status: BookingStatus.COMPLETED })
            .getRawOne(),
    ]);

    return {
        totalBookings,
        dailyBookings, // Actually future/today bookings, simpler for now
        totalRevenue: Number(revenueResult?.total || 0),
    };
  }

  async getRevenueOverTime(user: User, days: number = 7) {
      // Return last 7 days revenue
      const result = await this.bookingRepository
          .createQueryBuilder('booking')
          .select("TO_CHAR(booking.appointmentDate, 'YYYY-MM-DD')", 'date')
          .addSelect('SUM(booking.totalPrice)', 'revenue')
          .where('booking.shopId = :shopId', { shopId: user.shopId })
          .andWhere('booking.status = :status', { status: BookingStatus.COMPLETED })
          .groupBy("TO_CHAR(booking.appointmentDate, 'YYYY-MM-DD')")
          .orderBy('date', 'ASC')
          .limit(days)
          .getRawMany();

      return result.map(r => ({ date: r.date, revenue: Number(r.revenue) }));
  }
}
